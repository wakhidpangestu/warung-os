// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AuditAnchor} from "../src/AuditAnchor.sol";

contract AuditAnchorTest is Test {
    address private constant ADMIN = address(0xA11CE);
    address private constant WRITER = address(0xB0B);
    address private constant UNAUTHORIZED = address(0xBAD);

    AuditAnchor private anchor;

    function setUp() public {
        anchor = new AuditAnchor(ADMIN, WRITER);
    }

    function test_RevertWhenAdminIsZeroAddress() public {
        vm.expectRevert(AuditAnchor.ZeroAddress.selector);
        new AuditAnchor(address(0), WRITER);
    }

    function test_RevertWhenWriterIsZeroAddress() public {
        vm.expectRevert(AuditAnchor.ZeroAddress.selector);
        new AuditAnchor(ADMIN, address(0));
    }

    function test_RecordCommitmentByWriterStoresTimestampAndEmitsEvent() public {
        bytes32 commitment = keccak256("commitment-1");
        uint64 expectedTimestamp = uint64(block.timestamp);

        vm.expectEmit(true, false, false, true, address(anchor));
        emit AuditAnchor.CommitmentRecorded(commitment, expectedTimestamp);

        vm.prank(WRITER);
        anchor.recordCommitment(commitment);

        assertEq(anchor.commitmentTime(commitment), expectedTimestamp);
    }

    function test_RecordRootByWriterStoresRecordAndEmitsEvent() public {
        uint64 batchId = 42;
        bytes32 root = keccak256("root-42");
        uint32 count = 3;
        uint64 expectedTimestamp = uint64(block.timestamp);

        vm.expectEmit(true, false, false, true, address(anchor));
        emit AuditAnchor.RootRecorded(batchId, root, count, expectedTimestamp);

        vm.prank(WRITER);
        anchor.recordRoot(batchId, root, count);

        (bytes32 actualRoot, uint32 actualCount, uint64 actualTimestamp) = anchor.rootOf(batchId);
        assertEq(actualRoot, root);
        assertEq(actualCount, count);
        assertEq(actualTimestamp, expectedTimestamp);
    }

    function test_RevertWhenUnauthorizedAccountRecordsCommitment() public {
        bytes32 commitment = keccak256("unauthorized");

        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, UNAUTHORIZED, anchor.WRITER_ROLE()
            )
        );
        vm.prank(UNAUTHORIZED);
        anchor.recordCommitment(commitment);
    }

    function test_RevertWhenUnauthorizedAccountRecordsRoot() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, UNAUTHORIZED, anchor.WRITER_ROLE()
            )
        );
        vm.prank(UNAUTHORIZED);
        anchor.recordRoot(1, keccak256("root"), 1);
    }

    function test_RevertWhenCommitmentIsDuplicate() public {
        bytes32 commitment = keccak256("duplicate");
        vm.startPrank(WRITER);
        anchor.recordCommitment(commitment);

        vm.expectRevert(abi.encodeWithSelector(AuditAnchor.CommitmentAlreadyRecorded.selector, commitment));
        anchor.recordCommitment(commitment);
        vm.stopPrank();
    }

    function test_RevertWhenCommitmentIsZero() public {
        vm.expectRevert(AuditAnchor.ZeroCommitment.selector);
        vm.prank(WRITER);
        anchor.recordCommitment(bytes32(0));
    }

    function test_RevertWhenBatchIdIsDuplicate() public {
        uint64 batchId = 7;
        vm.startPrank(WRITER);
        anchor.recordRoot(batchId, keccak256("first"), 1);

        vm.expectRevert(abi.encodeWithSelector(AuditAnchor.BatchAlreadyRecorded.selector, batchId));
        anchor.recordRoot(batchId, keccak256("second"), 2);
        vm.stopPrank();
    }

    function test_DuplicateChecksRemainEffectiveAtTimestampZero() public {
        bytes32 commitment = keccak256("timestamp-zero");
        uint64 batchId = 8;
        vm.warp(0);

        vm.startPrank(WRITER);
        anchor.recordCommitment(commitment);
        anchor.recordRoot(batchId, keccak256("timestamp-zero-root"), 1);

        vm.expectRevert(abi.encodeWithSelector(AuditAnchor.CommitmentAlreadyRecorded.selector, commitment));
        anchor.recordCommitment(commitment);

        vm.expectRevert(abi.encodeWithSelector(AuditAnchor.BatchAlreadyRecorded.selector, batchId));
        anchor.recordRoot(batchId, keccak256("another-root"), 1);
        vm.stopPrank();
    }

    function test_RevertWhenRootIsZero() public {
        vm.expectRevert(AuditAnchor.ZeroRoot.selector);
        vm.prank(WRITER);
        anchor.recordRoot(1, bytes32(0), 1);
    }

    function test_RevertWhenCountIsZero() public {
        vm.expectRevert(AuditAnchor.ZeroCount.selector);
        vm.prank(WRITER);
        anchor.recordRoot(1, keccak256("root"), 0);
    }

    function test_AdminCanPauseAndWriterCannotRecordWhilePaused() public {
        vm.prank(ADMIN);
        anchor.pause();

        vm.expectRevert(Pausable.EnforcedPause.selector);
        vm.prank(WRITER);
        anchor.recordCommitment(keccak256("paused"));

        vm.prank(ADMIN);
        anchor.unpause();

        vm.prank(WRITER);
        anchor.recordCommitment(keccak256("unpaused"));
    }

    function test_RevertWhenUnauthorizedAccountPauses() public {
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, UNAUTHORIZED, bytes32(0))
        );
        vm.prank(UNAUTHORIZED);
        anchor.pause();
    }

    function test_AdminCanGrantAndRevokeWriterRole() public {
        address newWriter = address(0xCAFE);
        bytes32 writerRole = anchor.WRITER_ROLE();

        vm.prank(ADMIN);
        anchor.grantRole(writerRole, newWriter);
        assertTrue(anchor.hasRole(writerRole, newWriter));

        vm.prank(newWriter);
        anchor.recordCommitment(keccak256("new-writer"));

        vm.prank(ADMIN);
        anchor.revokeRole(writerRole, newWriter);
        assertFalse(anchor.hasRole(writerRole, newWriter));

        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, newWriter, writerRole)
        );
        vm.prank(newWriter);
        anchor.recordCommitment(keccak256("revoked-writer"));
    }

    function testFuzz_RecordRoot(uint64 batchId, bytes32 root, uint32 count) public {
        vm.assume(root != bytes32(0));
        vm.assume(count > 0);

        vm.prank(WRITER);
        anchor.recordRoot(batchId, root, count);

        (bytes32 actualRoot, uint32 actualCount, uint64 timestamp) = anchor.rootOf(batchId);
        assertEq(actualRoot, root);
        assertEq(actualCount, count);
        assertEq(timestamp, uint64(block.timestamp));
    }

    function testFuzz_RecordCommitment(bytes32 commitment) public {
        vm.assume(commitment != bytes32(0));

        vm.prank(WRITER);
        anchor.recordCommitment(commitment);

        assertEq(anchor.commitmentTime(commitment), uint64(block.timestamp));
    }
}

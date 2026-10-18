// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {AuditAnchor} from "../src/AuditAnchor.sol";

contract AuditAnchorHandler is Test {
    AuditAnchor private immutable _anchor;
    uint64[] private _batchIds;
    mapping(uint64 batchId => bytes32 root) private _roots;
    mapping(uint64 batchId => uint32 count) private _counts;
    mapping(uint64 batchId => uint64 timestamp) private _timestamps;
    mapping(uint64 batchId => bool seen) private _seen;

    constructor(AuditAnchor anchor) {
        _anchor = anchor;
    }

    function recordRoot(uint64 batchId, bytes32 root, uint32 count) external {
        root = root == bytes32(0) ? bytes32(uint256(1)) : root;
        count = count == 0 ? 1 : count;

        try _anchor.recordRoot(batchId, root, count) {
            if (!_seen[batchId]) {
                _seen[batchId] = true;
                _batchIds.push(batchId);
                _roots[batchId] = root;
                _counts[batchId] = count;
                (,, _timestamps[batchId]) = _anchor.rootOf(batchId);
            }
        } catch {}
    }

    function attemptOverwrite(uint256 index, bytes32 root, uint32 count) external {
        if (_batchIds.length == 0) return;

        uint64 batchId = _batchIds[index % _batchIds.length];
        root = root == bytes32(0) ? bytes32(uint256(1)) : root;
        count = count == 0 ? 1 : count;

        try _anchor.recordRoot(batchId, root, count) {} catch {}
    }

    function batchCount() external view returns (uint256) {
        return _batchIds.length;
    }

    function expectedRootAt(uint256 index)
        external
        view
        returns (uint64 batchId, bytes32 root, uint32 count, uint64 timestamp)
    {
        batchId = _batchIds[index];
        return (batchId, _roots[batchId], _counts[batchId], _timestamps[batchId]);
    }
}

contract AuditAnchorInvariantTest is Test {
    AuditAnchor private anchor;
    AuditAnchorHandler private handler;

    function setUp() public {
        anchor = new AuditAnchor(address(this), address(this));
        handler = new AuditAnchorHandler(anchor);
        anchor.grantRole(anchor.WRITER_ROLE(), address(handler));
        targetContract(address(handler));
    }

    function invariant_BatchIdCannotBeOverwritten() public view {
        uint256 length = handler.batchCount();
        for (uint256 i; i < length; ++i) {
            (uint64 batchId, bytes32 expectedRoot, uint32 expectedCount, uint64 expectedTimestamp) =
                handler.expectedRootAt(i);
            (bytes32 root, uint32 count, uint64 timestamp) = anchor.rootOf(batchId);
            assertEq(root, expectedRoot);
            assertEq(count, expectedCount);
            assertEq(timestamp, expectedTimestamp);
        }
    }
}

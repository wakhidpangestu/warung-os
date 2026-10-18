// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/// @title AuditAnchor
/// @notice Anchors opaque audit commitments and Merkle roots without business or personal data.
contract AuditAnchor is AccessControl, Pausable {
    bytes32 public constant WRITER_ROLE = keccak256("WRITER_ROLE");

    struct RootRecord {
        bytes32 root;
        uint32 count;
        uint64 timestamp;
    }

    mapping(bytes32 commitment => uint64 timestamp) private _commitmentTimes;
    mapping(bytes32 commitment => bool exists) private _commitmentExists;
    mapping(uint64 batchId => RootRecord record) private _roots;
    mapping(uint64 batchId => bool exists) private _rootExists;

    error CommitmentAlreadyRecorded(bytes32 commitment);
    error BatchAlreadyRecorded(uint64 batchId);
    error ZeroAddress();
    error ZeroCommitment();
    error ZeroRoot();
    error ZeroCount();

    event CommitmentRecorded(bytes32 indexed commitment, uint64 timestamp);
    event RootRecorded(uint64 indexed batchId, bytes32 root, uint32 count, uint64 timestamp);

    constructor(address admin, address writer) {
        if (admin == address(0) || writer == address(0)) {
            revert ZeroAddress();
        }
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WRITER_ROLE, writer);
    }

    /// @notice Records a unique opaque commitment with the current block timestamp.
    function recordCommitment(bytes32 commitment) external onlyRole(WRITER_ROLE) whenNotPaused {
        if (commitment == bytes32(0)) {
            revert ZeroCommitment();
        }
        if (_commitmentExists[commitment]) {
            revert CommitmentAlreadyRecorded(commitment);
        }

        uint64 timestamp = uint64(block.timestamp);
        _commitmentTimes[commitment] = timestamp;
        _commitmentExists[commitment] = true;
        emit CommitmentRecorded(commitment, timestamp);
    }

    /// @notice Records a unique Merkle root for an audit batch.
    function recordRoot(uint64 batchId, bytes32 root, uint32 count) external onlyRole(WRITER_ROLE) whenNotPaused {
        if (_rootExists[batchId]) {
            revert BatchAlreadyRecorded(batchId);
        }
        if (root == bytes32(0)) {
            revert ZeroRoot();
        }
        if (count == 0) {
            revert ZeroCount();
        }

        uint64 timestamp = uint64(block.timestamp);
        _roots[batchId] = RootRecord({root: root, count: count, timestamp: timestamp});
        _rootExists[batchId] = true;
        emit RootRecorded(batchId, root, count, timestamp);
    }

    function commitmentTime(bytes32 commitment) external view returns (uint64) {
        return _commitmentTimes[commitment];
    }

    function rootOf(uint64 batchId) external view returns (bytes32 root, uint32 count, uint64 timestamp) {
        RootRecord memory record = _roots[batchId];
        return (record.root, record.count, record.timestamp);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}

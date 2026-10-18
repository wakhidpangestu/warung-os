// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {AuditAnchor} from "../src/AuditAnchor.sol";

/// @notice Deploys AuditAnchor and checks its configured roles immediately after deployment.
/// @dev Provide ADMIN and WRITER through the environment. Sign with Forge's --account option.
contract DeployAuditAnchor is Script {
    error PostDeploymentVerificationFailed();

    function run() external returns (AuditAnchor anchor) {
        address admin = vm.envAddress("ADMIN");
        address writer = vm.envAddress("WRITER");

        vm.startBroadcast();
        anchor = new AuditAnchor(admin, writer);
        vm.stopBroadcast();

        if (!anchor.hasRole(anchor.DEFAULT_ADMIN_ROLE(), admin) || !anchor.hasRole(anchor.WRITER_ROLE(), writer)) {
            revert PostDeploymentVerificationFailed();
        }
    }
}

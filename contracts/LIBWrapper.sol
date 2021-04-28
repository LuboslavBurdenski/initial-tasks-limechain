// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./LIBRARY.sol";

contract LIBWrapper {
    LIBRARY public LIBToken;
  
    constructor() public {
        LIBToken = new LIBRARY();
    }

    function wrap() public payable {
        require(msg.value > 0, "We need to wrap at least 1 wei");
        LIBToken.mint(msg.sender, msg.value);
    }

    function unwrap(uint256 value) public {
        require(value > 0, "We need to unwrap at least 1 wei");
        LIBToken.transferFrom(msg.sender, address(this), value);
        LIBToken.burn(value);
        msg.sender.transfer(value);
    }

    receive() external payable {
        wrap();
    }

    fallback() external payable {
        wrap();
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LIB.sol";
import "./LIBWrapper.sol";

contract LIBRARY {
    address owner;
    IERC20 public LIBToken;
    LIBWrapper public LIBWrapperContract;

    address payable wrapperContractAddress;

    constructor(address LIBTokenAddress, address payable LIBWrapperAddress)
        public
    {
        LIBToken = IERC20(LIBTokenAddress);
        LIBWrapperContract = LIBWrapper(LIBWrapperAddress);
        wrapperContractAddress = LIBWrapperAddress;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only admin can add books");
        _;
    }

    modifier bookExists(bytes32 _name) {
        require(bytes(books[_name].name).length != 0, "the book doesn't exist");
        _;
    }

    struct Book {
        string name;
        uint256 numberOfCopies;
        address[] userAddresses;
    }

    bytes32[] public bookIds;

    mapping(bytes32 => Book) public books;

    mapping(address => mapping(bytes32 => bool)) internal users;

    function addBook(string memory _name, uint256 _numberOfCopies)
        public
        onlyOwner
    {
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
        if (bytes(books[hashedName].name).length == 0) {
            books[hashedName] = Book(_name, _numberOfCopies, new address[](0));
            bookIds.push(hashedName);
        } else {
            books[hashedName].numberOfCopies += _numberOfCopies;
        }
    }

    function borrowBook(bytes32 _name) external bookExists(_name) {
        require(
            LIBToken.allowance(msg.sender, address(this)) >= 100000000000000000,
            "renting not allowed"
        );
        require(books[_name].numberOfCopies >= 1, "there is no copy available");
        require(
            users[msg.sender][_name] != true,
            "user has already borrowed the book"
        );
        LIBToken.transferFrom(msg.sender, address(this), 100000000000000000);
        users[msg.sender][_name] = true;
        books[_name].userAddresses.push(msg.sender);
        books[_name].numberOfCopies--;
    }

    function returnBook(bytes32 _name) public bookExists(_name) {
        require(
            users[msg.sender][_name] == true,
            "you haven't borrowed a book with the given id"
        );
        users[msg.sender][_name] = false;
        books[_name].numberOfCopies++;
    }

    function getUsersWhoBorrowedBook(bytes32 _name)
        public
        view
        bookExists(_name)
        returns (address[] memory)
    {
        return books[_name].userAddresses;
    }

    function unwrap() public onlyOwner {
        uint256 contractBalance = LIBToken.balanceOf(address(this));
        LIBToken.approve(wrapperContractAddress, contractBalance);
        LIBWrapperContract.unwrap(contractBalance);
        msg.sender.transfer(contractBalance);
    }

    function checkIfOwner(address _name) public view returns (bool) {
        return owner == _name;
    }

    function checkIfBookIsRented(bytes32 _name) public view returns (bool) {
        return users[msg.sender][_name];
    }

    function getAllBooks() public view returns (uint256) {
        return bookIds.length;
    }

    receive() external payable {}

    fallback() external payable {}
}

// etherlime compile -—solcVersion=0.7.5

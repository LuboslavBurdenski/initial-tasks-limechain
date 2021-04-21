// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookLibrary {
    address owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, 'only admin can add books');
        _;
    }
      
    modifier bookExists(bytes32 _name) {
        require(bytes(books[_name].name).length != 0, "the book doesn't exist");
        _;
    }
    
    struct Book {
        string name;
        uint numberOfCopies;
        address[] userAddresses;
    }
  
    bytes32[] public bookIds;
    
    mapping (bytes32 => Book) public books;
    
    mapping(address => mapping(bytes32 => bool)) internal users;
       
    function addBook(string memory _name, uint _numberOfCopies) public onlyOwner {
        bytes32 length = keccak256(abi.encodePacked(bookIds.length));
        bytes32 hashedName = keccak256(abi.encodePacked(_name)); 
      
        if(bytes(books[hashedName].name).length == 0){
            books[hashedName] = Book(_name, _numberOfCopies, new address[](0));
            bookIds.push(hashedName);
        } else {
            books[hashedName].numberOfCopies += _numberOfCopies;
        }
        
    }
  
    function borrowBook(string memory _name) external bookExists(keccak256(abi.encodePacked(_name))){
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
    
        require(books[hashedName].numberOfCopies > 0, 'there is no copy available');
        require(users[msg.sender][hashedName] != true, 'user has already borrowed the book');
      
        users[msg.sender][hashedName] = true;
        books[hashedName].userAddresses.push(msg.sender);
        books[hashedName].numberOfCopies -= 1;
    }
    
    
    function returnBook(string  memory _name) public bookExists(keccak256(abi.encodePacked(_name))){
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
        require(users[msg.sender][hashedName] == true, "you haven't borrowed a book with the given id");
        users[msg.sender][hashedName] = false;
        books[hashedName].numberOfCopies += 1;
    }
    
    function getUsersWhoBorrowedBook(string memory _name) public view bookExists(keccak256(abi.encodePacked(_name))) returns (address[] memory){
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
        return books[hashedName].userAddresses;
    } 
    
}
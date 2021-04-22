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
        bytes32 hashedName = keccak256(abi.encodePacked(_name));
        if(bytes(books[hashedName].name).length == 0){
            books[hashedName] = Book(_name, _numberOfCopies, new address[](0));
            bookIds.push(hashedName);
        } else {
            books[hashedName].numberOfCopies += _numberOfCopies;
        }
        
    }
  
    function borrowBook(bytes32 _name) external bookExists(_name){
        require(books[_name].numberOfCopies > 0, 'there is no copy available');
        require(users[msg.sender][_name] != true, 'user has already borrowed the book');
      
        users[msg.sender][_name] = true;
        books[_name].userAddresses.push(msg.sender);
        books[_name].numberOfCopies -= 1;
    }
    
    
    function returnBook(bytes32 _name) public bookExists(_name){
        require(users[msg.sender][_name] == true, "you haven't borrowed a book with the given id");
        users[msg.sender][_name] = false;
        books[_name].numberOfCopies += 1;
    }
    
    function getUsersWhoBorrowedBook(bytes32 _name) public view bookExists(_name) returns (address[] memory){
        return books[_name].userAddresses;
    } 
    
    function checkIfBookIsRented(bytes32 _name) public view returns(bool){
        return users[msg.sender][_name];
    }
    
    function getAllBooks() public view returns(uint){
         return bookIds.length;
    }
     
}
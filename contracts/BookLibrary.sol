// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookLibrary {
    uint counter = 0;
    constructor(){}
    struct Book {
        uint id;
        string name;
        uint numberOfCopies;
        address[] userAddresses;
    }
    
    Book[] internal books;
    
    mapping(address => uint[]) internal users;
       
    function addBook(string memory _name, uint  _numberOfCopies) public {
        bool doesExist = false;
        for (uint i = 0; i < books.length; i++) {
            string memory current = books[i].name;
            if(
                keccak256(abi.encodePacked(current)) == 
                keccak256(abi.encodePacked(_name)))
            {
                doesExist = true;
                books[i].numberOfCopies += _numberOfCopies;
                break;
            }
        }
        if(!doesExist){
            Book memory book = Book(counter,_name, _numberOfCopies, new address[](0));
            books.push(book);
            counter++; 
        }
    }
    
    function getUserBooks() external view returns (uint[] memory){
        return users[msg.sender];
    }
    
    function getAllBooks() external view returns(string[] memory, uint[] memory){
        string[] memory names = new string[](books.length);
        uint[] memory ids = new uint[](books.length);
        
        for (uint i = 0; i < books.length; i++) {
            names[i] = books[i].name;
            ids[i] = books[i].id;
        }
    
        return (names, ids);
    } 
    
    string mostUsedError = "the book doesn't exist";
    
    function borrowBook(uint id) external {
        require(id <= books.length - 1, mostUsedError);
        require(id >= 0, mostUsedError);
        require(books[id].numberOfCopies > 0, 'there is no copy available');
        
        bool doesExist = false;
        bool userHasEverBorrowedTheBook = false;
        
        for (uint i = 0; i < users[msg.sender].length; i++) {
           if(users[msg.sender][i] == id){
                doesExist = true;
                break;
           }
        }
        
        require(doesExist == false, 'you have already borrowed the book');
        
        for (uint j = 0; j < books[id].userAddresses.length; j++) {
           if( books[id].userAddresses[j] == msg.sender){
                userHasEverBorrowedTheBook = true;
                break;
           }
        }
        
        if(!userHasEverBorrowedTheBook){ books[id].userAddresses.push(msg.sender);}

        users[msg.sender].push(id);
        books[id].numberOfCopies -= 1;
    }
    
    function returnBook(uint id) external{
        require(id <= books.length - 1, mostUsedError);
        require(id >= 0, mostUsedError);
        bool doesExist = false;
        
        for (uint i = 0; i < users[msg.sender].length; i++) {
           if(users[msg.sender][i] == id){
             doesExist = true;
             books[id].numberOfCopies += 1;
             users[msg.sender][i] = users[msg.sender][users[msg.sender].length - 1];
             users[msg.sender].pop();
             break;
           }
        }
        require(doesExist == true, "you haven't borrowed a book with the given id");
    }
    
    function getUsersWhoBorrowedBook(uint id) public view returns (address[] memory){
        return books[id].userAddresses;
    }
    
}
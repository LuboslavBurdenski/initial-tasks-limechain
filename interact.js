const { ethers } = require("ethers");
const BookLibrary = require('./build/BookLibrary.json')

const run = async function () {
    const provider = new ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173")
    const wallet = new ethers.Wallet("1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214", provider)
    const bookLibraryContract = new ethers.Contract("0x5818871A858f71cdBA3Af1B8ACf841fFc0eFf16d", BookLibrary.abi, wallet);

    //adding new book
    await bookLibraryContract.addBook('book2', 10);
    
    const booksLength = await bookLibraryContract.getAllBooks();
    
    let arrOfBooks = {};

    if (booksLength > 0) {
        // making an object with property array in which we save the name and number of copies
        for (let i = 0; i < booksLength; i++) {
            const bookHash = await bookLibraryContract.bookIds(i);
            const [book, copies] = await bookLibraryContract.books(bookHash);
            console.log(`Available books: ${book} - ${copies}`);
            arrOfBooks[bookHash.toString()] = [book, Number(copies.toString())];
        }
    }
    //getting the keys and values of our main object
    const entries = Object.entries(arrOfBooks);
    //getting the hash of the first book 
    const firstHashOfBookToWorkWith = entries[0][0].toString();
    //check if book is rented/borrowed
    const isRented = await bookLibraryContract.checkIfBookIsRented(firstHashOfBookToWorkWith);
    //borrowing the book
    console.log(`Rented: ${isRented}`)
    const borrowingBook = await (await bookLibraryContract.borrowBook(firstHashOfBookToWorkWith)).wait();
    //returning the book and checking if the function had executed in the right way
    console.log(`Rented: ${isRented}`)
    const returningBook = await (await bookLibraryContract.returnBook(firstHashOfBookToWorkWith)).wait();
    console.log(`Rented: ${isRented}`)
    //checking the avalability of the book again
    const avalabilityOfBook = await bookLibraryContract.books(firstHashOfBookToWorkWith);
    console.log(`Availability of the book: ${avalabilityOfBook[1]}`)
}
run()
//etherlime deploy --file=./deployment/deploy.js --network=ropsten --secret=1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214`
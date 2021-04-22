const { ethers } = require("ethers");
const BookLibrary = require('./build/BookLibrary.json')

const run = async function () {
    const provider = new ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173")
    const wallet = new ethers.Wallet("1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214", provider)
    const bookLibraryContract = new ethers.Contract("0x5818871A858f71cdBA3Af1B8ACf841fFc0eFf16d", BookLibrary.abi, wallet);

    //await bookLibraryContract.addBook('book2', 10);

    const booksLength = await bookLibraryContract.getAllBooks();

    let arrOfBooks = {};

    if (booksLength > 0) {
        for (let i = 0; i < booksLength; i++) {
            const bookHash = await bookLibraryContract.bookIds(i);
            const [book, copies] = await bookLibraryContract.books(bookHash);
            console.log(bookHash)
            arrOfBooks[bookHash.toString()] = [book, Number(copies.toString())];
        }
    }

    const entries = Object.entries(arrOfBooks);
    for (let i = 0; i < entries.length; i++) {
        console.log(`Available books: ${entries[i][1][0]} - ${entries[i][1][1]}`)
    }

    const firstHashOfBookToWorkWith = entries[0][0].toString();

    const borrowingBook = await (await bookLibraryContract.borrowBook(firstHashOfBookToWorkWith)).wait();
    const returningBook = await (await bookLibraryContract.returnBook(firstHashOfBookToWorkWith)).wait();
   
    const isRented = await bookLibraryContract.checkIfBookIsRented(firstHashOfBookToWorkWith);
    console.log(`Rented: ${isRented}`)

    const avalabilityOfBook = await bookLibraryContract.books(firstHashOfBookToWorkWith);
    entries[0][0] = avalabilityOfBook; //just to update the object, although it is pointless, just added a bit more abstraction :)
    console.log(`Availability of the book: ${avalabilityOfBook[1]}`)

}
run()
//etherlime deploy --file=./deployment/deploy.js --network=ropsten --secret=1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214`
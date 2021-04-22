const { ethers } = require("ethers");
const BookLibrary = require('./build/BookLibrary.json')

const run = async function () {
    const provider = new ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173")
    const wallet = new ethers.Wallet("1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214", provider)
    const bookLibraryContract = new ethers.Contract("0x5818871A858f71cdBA3Af1B8ACf841fFc0eFf16d", BookLibrary.abi, wallet);

    //await bookLibraryContract.addBook('book2', 10);

    const booksLength = await (await bookLibraryContract.getAllBooks()).toString();

    let arrOfBooks = {};

    if (booksLength > 0) {
        for (let i = 0; i < booksLength; i++) {
            const bookHash = await bookLibraryContract.bookIds(i);
            const [book, copies] = await bookLibraryContract.books(bookHash.toString());
            arrOfBooks[bookHash.toString()] = await [book, Number(copies.toString())];
        }
    }
    const entries = Object.entries(arrOfBooks);
    for (let i = 0; i < entries.length; i++) {
    console.log(`Available books: ${entries[i][1][0]} - ${entries[i][1][1]}`)
    }

    const firstHashOfBookToWorkWith = entries[0][0].toString();
   
    const borrowingBook = await bookLibraryContract.borrowBook(firstHashOfBookToWorkWith);
    const borrowingBookReceipt = await borrowingBook.wait();
    //console.log(borrowingBookReceipt)

    const returningBook = await bookLibraryContract.returnBook(firstHashOfBookToWorkWith);
    const returningBookReceipt = await returningBook.wait();
    //console.log(returningBookReceipt)

    const isRented = await bookLibraryContract.checkIfBookIsRented("0xcecdae0a4be9f587cfc6338a773943ec4359c412e5a7c43534badc1add55a421");
    console.log(`Rented: ${isRented}`)

    const avalabilityOfBook = await bookLibraryContract.books(entries[0][0].toString());
    entries[0][0] = avalabilityOfBook; //just to update the object, although it is pointless, just added a bit more abstraction :)
    console.log(`Availability of the book: ${avalabilityOfBook[1]}`)

}
run()
//etherlime deploy --file=./deployment/deploy.js --network=ropsten --secret=1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214`
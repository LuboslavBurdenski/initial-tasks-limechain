const { ethers } = require("ethers");
const BookLibrary = require('./build/BookLibrary.json')

const run = async function () {
    const provider = new ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173")
    const wallet = new ethers.Wallet("1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214", provider)
    const bookLibraryContract = new ethers.Contract("0x8Fe97e2d321F71656A9a9d631021160FBF0b31cF", BookLibrary.abi, wallet);
    // await bookLibraryContract.addBook('first', 10);
    // await bookLibraryContract.addBook('book222', 10);

    const book1 = await bookLibraryContract.bookIds(0);
    const book222 = await bookLibraryContract.bookIds(2);
   // const bookStruct = await bookLibraryContract.books(book1.toString());

    console.log(book1);
    console.log(book222);
    console.log(await(await bookLibraryContract.books(book222)).numberOfCopies.toString());
}
run()
//sudo etherlime deploy --file=./deployment/deploy.js --network=ropsten --secret=1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214`
let bd;
let reqBD = indexedDB.open('meuBD', 1);
reqBD.onsuccess = () => {
    bd = reqBD.result;
}
reqBD.onerror = () => {
    console.log(reqBD.error)
}
reqBD.onupgradeneeded = (e) => {
    bd = reqBD.result;

    if (!bd.objectStoreNames.contains('livros')) {
        let livrosOS = bd.createObjectStore('livros', { keyPath: 'id' });
        livrosOS.createIndex('tituloIDX', 'titulo', {unique: false})
        livrosOS.createIndex('autorIDX', 'autor', {unique: false})
    }
}
onload = () => {

    //create
    btnC.onclick = () => {
        let livro = {
            id: +idLivro.value,
            titulo: titulo.value,
            autor: autor.value
        }
        let transacaoBD = bd.transaction(['livros'], ['readwrite']);
        let livrosOS = transacaoBD.objectStore('livros');
        let reqOS = livrosOS.add(livro);
        reqOS.onsuccess = (e) => {
            console.log(reqOS.result);
        }
        reqOS.onerror = (e) => {
            console.log(reqOS.error);
        }
        console.log(livro)
    };

    //read
    btnR.onclick = () => {
        bd.transaction('livros').objectStore('livros').get(+idLivro.value).onsuccess = (e) => {
            titulo.value = e.target.result.titulo
            autor.value = e.target.result.autor;
        }
    }
    //Delete
    btnD.onclick = () => {
        bd.transaction(['livros'], 'readwrite').objectStore('livros').delete(+idLivro.value).onsuccess = (e) => {
            console.log('livro excluído');
        }
    }
    //Atualizar
    btnU.onclick = () => {

        let livro = {
            id: +idLivro.value,
            titulo: titulo.value,
            autor: autor.value
        }

        bd.transaction(['livros'], 'readwrite').objectStore('livros').put(livro).onsuccess = (e) => {
            console.log('livro atualizado');
        }
    }
    //Listagem
    btnL.onclick = () => {
        bd.transaction('livros').objectStore('livros').openCursor().onsuccess = (e) => {
            let cursor = e.target.result;
            if(cursor){
                console.log(cursor.value);
                cursor.continue();
            }else{
                console.log('Fim!')
            }
        }
    }
    //Listagem por título
    btnRT.onclick = () => {
        bd.transaction('livros').objectStore('livros').index('tituloIDX').get(titulo.value).onsuccess = (e) => {
            idLivro.value = e.target.result.id;
            titulo.value = e.target.result.titulo
            autor.value = e.target.result.autor;
            console.log(e.target.result)
        }
    }

    //Listagem por autor
    btnLA.onclick = () => {
        bd.transaction('livros').objectStore('livros').index('autorIDX').getAll(IDBKeyRange.only(autor.value)).onsuccess = (e) => {

            console.log(e.target.result)

        }
    }
}
document.addEventListener('DOMContentLoaded', () => {

    // Páginas que contienen los productos
    const pages = {
        sneakers: 'templates/sneakers.html',
        watches: 'templates/watches.html',
        caps: 'templates/caps.html'
    };

    // Cuenta únicamente los productos que están en STOCK
    function countStock(documentPage) {

        const cards = documentPage.querySelectorAll('.sneaker-card');

        let stock = 0;

        cards.forEach(card => {

            // Los badges están DENTRO de .sneaker-card,
            // por eso buscamos los elementos internos.
            const isSold = card.querySelector('.badge-sold');
            const isReturn = card.querySelector('.badge-return');
            const isDead = card.querySelector('.badge-dead');

            // Si no tiene ningún badge de estado,
            // significa que está disponible / en STOCK.
            if (!isSold && !isReturn && !isDead) {
                stock++;
            }
        });

        return stock;
    }

    // Carga una página HTML y obtiene su stock
    async function getStockFromPage(url) {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`No se pudo cargar ${url}`);
        }

        const html = await response.text();

        const parser = new DOMParser();
        const documentPage = parser.parseFromString(html, 'text/html');

        return countStock(documentPage);
    }

    // Carga las tres categorías al mismo tiempo
    async function updateStock() {

        try {

            const [sneakers, watches, caps] = await Promise.all([
                getStockFromPage(pages.sneakers),
                getStockFromPage(pages.watches),
                getStockFromPage(pages.caps)
            ]);

            const total = sneakers + watches + caps;

            // Actualizar Dashboard
            document.getElementById('totalSneakers').textContent = sneakers;
            document.getElementById('totalWatches').textContent = watches;
            document.getElementById('totalCaps').textContent = caps;
            document.getElementById('totalStock').textContent = total;

        } catch (error) {

            console.error('Error al cargar el stock:', error);

        }
    }

    // Ejecutar cálculo
    updateStock();

});
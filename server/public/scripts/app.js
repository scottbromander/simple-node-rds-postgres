// Some dirty JS
const button = document.getElementById('btn-send');

const addItem = (event) => {
    const data = {
        input: document.getElementById('input-value').value
    }

    fetch('/add-item', 
            {
                method: 'POST', 
                mode: 'cors', 
                cache: 'no-cache',
                credentials: 'same-origin', 
                headers: {
                'Content-Type': 'application/json'
                },
                redirect: 'follow', 
                referrerPolicy: 'no-referrer', 
                body: JSON.stringify(data) 
            }
        )
        .then(() => {
            document.getElementById('input-value').value = '';
            getItems();
        })
        .catch(err => console.log(err));
}

const getItems = () => {
    try {
        fetch('/rds-test').then( async (response) => {
            Promise.resolve(await response.json()).then(data => {
                updateView(data);
            });
        });
    }
    catch(err) {
        console.warn(err);
    }
}

button.addEventListener('click', addItem);
getItems();

const updateView = (data) => {
    const element = document.getElementById('container');
    element.innerHTML = '';
    for(let item of data) {
        let node = document.createElement("p");
        node.innerText = item.name;
        element.appendChild(node);
    }
}
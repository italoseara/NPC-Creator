let yml = "nps:\n";
let searching = false;

const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
const form = document.querySelector('form');

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const getUniqueId = async (nickname) => {
    const url = "https://api.mojang.com/users/profiles/minecraft/" + nickname;

    const response = await fetch(proxyUrl + url);
    const data = await response.json();

    return data.id;
}

const getSkinData = async (nickname) => {
    const uuid = await getUniqueId(nickname);
    const url = "https://sessionserver.mojang.com/session/minecraft/profile/" + uuid + "?unsigned=false";

    const response = await fetch(proxyUrl + url);
    const data = await response.json();

    return {
        signature: data.properties[0].signature,
        texture: data.properties[0].value
    }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (searching) return;

    searching = true;

    const name = form.querySelector('#name').value;
    const id = slugify(name);

    const description = form.querySelector('#description').value;
    const rarity = form.querySelector('#rarity').value;
    const skin = form.querySelector('#skin').value;
    const skinData = await getSkinData(skin);

    console.log(name, description, rarity, skin);

    yml += "  " + id + ":\n";
    yml += "    name: \"" + name + "\"\n";
    yml += "    description: \"" + description + "\"\n";
    yml += "    rarity: " + rarity + "\n";
    yml += "    skin:\n";
    yml += "      signature: \"" + skinData.signature + "\"\n";
    yml += "      texture: \"" + skinData.texture + "\"\n";

    const output = document.querySelector('#output pre');
    output.innerHTML = yml;

    const image = document.querySelector('#skin-img');
    image.src = "img/steve.png";

    form.querySelector('#name').value = '';
    form.querySelector('#description').value = '';
    form.querySelector('#rarity').value = '';
    form.querySelector('#skin').value = '';
});

const skinInput = form.querySelector('#skin');
skinInput.addEventListener('input', async function() {
    const nickname = skinInput.value;

    const image = document.querySelector('#skin-img');
    image.src = "https://mc-heads.net/body/" + nickname + "/128";
});

const copyButton = document.querySelector('#copy');

copyButton.addEventListener('click', function() {
    const output = document.querySelector('#output pre');
    const text = output.innerText;

    navigator.clipboard.writeText(text);
});
let yml = "nps:\n";
let searching = false;
let lastKeyboardInput = 0;

const form = document.querySelector('form');

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const getSkinData = async (nickname) => {
    const url = "https://api.ashcon.app/mojang/v2/user/" + nickname;

    const response = await fetch(url);
    const data = await response.json();

    return data.textures.raw;
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

    yml += "  " + id + ":\n";
    yml += "    name: \"" + name + "\"\n";
    yml += "    description: \"" + description + "\"\n";
    yml += "    rarity: " + rarity + "\n";
    yml += "    skin:\n";
    yml += "      signature: \"" + skinData.signature + "\"\n";
    yml += "      texture: \"" + skinData.value + "\"\n";

    const output = document.querySelector('#output pre');
    output.innerHTML = yml;

    const image = document.querySelector('#skin-img');
    image.src = "img/steve.png";

    form.querySelector('#name').value = '';
    form.querySelector('#description').value = '';
    form.querySelector('#rarity').value = '';
    form.querySelector('#skin').value = '';

    searching = false;
});

const copyButton = document.querySelector('#copy');

copyButton.addEventListener('click', function() {
    const output = document.querySelector('#output pre');
    const text = output.innerText;

    navigator.clipboard.writeText(text);
});

const skinInput = form.querySelector('#skin');
setInterval(() => {
    if (Date.now() - lastKeyboardInput < 500) return;

    const skin = skinInput.value;
    if (!skin) return;

    const image = document.querySelector('#skin-img');
    image.src = "https://mc-heads.net/body/" + skin + "/128";
}, 100);

skinInput.addEventListener('input', function() {
    lastKeyboardInput = Date.now();
});
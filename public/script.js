function clickImage() {
    document.getElementById("hiddenInput").click();
}

hiddenInput.onchange = evt => {
    const [file] = hiddenInput.files
    if (file && file.type.split("/")[0] == "image") {
        uploadImage.src = URL.createObjectURL(file);
    }
}
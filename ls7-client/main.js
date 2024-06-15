const myForm = document.querySelector("#my-form")

myForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    e.stopPropagation()
    const password = e.target.password.value
    const username = e.target.username.value

    const resElement = document.querySelector("#response")


    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        body: JSON.stringify({
            password,
            username
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const json = await response.json()

    resElement.textContent = JSON.stringify(json)


})
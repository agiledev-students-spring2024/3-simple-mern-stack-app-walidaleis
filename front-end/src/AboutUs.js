// import 'back-end/app.js'
// const myModule = require('/back-end/app.js')

function AboutUs() {
    const apiUrl = "http://localhost:5002/about_us"

    function fetchData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                document.getElementById("personal-photo").src = data.image
                document.getElementById("about-me").innerText = data.content
            })
    }

    fetchData();

    return (
        <div className="profile">
            <img id="personal-photo" alt="Profile"
className="personal-photo" width="300px"/>
            <p id="about-me"
className="about-me"></p>
        </div>
    )
}

export default AboutUs
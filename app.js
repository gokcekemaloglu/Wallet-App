//^ Selectors

const ekleBtn = document.getElementById("ekle-btn")
const gelirInput = document.getElementById("gelir-input")
const ekleFormu = document.getElementById("ekle-formu")

const gelirinizTd = document.getElementById("geliriniz")
const giderinizTd = document.getElementById("gideriniz")
const kalanTd = document.getElementById("kalan")

//^ Variables

let gelirler = 0
let harcamaListesi = []

//^ Harcama Formu

const harcamaFormu = document.getElementById("harcama-formu")
const harcamaAlaniInput = document.getElementById("harcama-alani")
const tarihInput = document.getElementById("tarih")
const harcamaInput = document.getElementById("miktar")

//^ Harcama Tablosu

const harcamaBody = document.getElementById("harcama-body")

//? Ekle Formu

ekleFormu.addEventListener("submit", (e) => {
    e.preventDefault()
    gelirler = gelirler + Number(gelirInput.value)
    console.log(gelirler)
    ekleFormu.reset()
    localStorage.setItem("Gelirler", gelirler)
    gelirinizTd.textContent = new Intl.NumberFormat().format(gelirler)

})

window.addEventListener("load",()=>{
    gelirler = Number(localStorage.getItem("gelirler")) || 0
    gelirinizTd.textContent = new Intl.NumberFormat().format(gelirler)
})

harcamaFormu.addEventListener("submit", (e) => {
    e.preventDefault() //reload önlemek için
    // console.log(tarihInput.value);
    const yeniHarcama = {
        id: new Date().getTime(), //! sistem saatini milisaniye olarak verir
        tarih: new Date(tarihInput.value).toLocaleDateString(),
        miktar: harcamaInput.value,
        alan: harcamaAlaniInput.value
    }
    
    harcamaListesi.push(yeniHarcama)
    console.log(harcamaListesi);
    harcamaFormu.reset()
    tarihInput.valueAsDate = new Date()
    localStorage.setItem("harcamaListesi", JSON.stringify(harcamaListesi))
    harcamaYaz(yeniHarcama)
})

const harcamaYaz = ({id, tarih, miktar, alan}) => {

    // harcamaBody.innerHTML += `
    // <tr>
    //     <td>${tarih}</td>
    //     <td>${alan}</td>
    //     <td>${miktar}</td>
    //     <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>
    // </tr>
    // `

    const tr = document.createElement("tr")

    const appendTd = (content) => {
        const td = document.createElement("td")
        td.textContent = content
        return td
    }
    
    const createLastTd = () => {
        const td = document.createElement("td")
        const i = document.createElement("i")
        i.id = id
        i.classList.add("fa-solid", "fa-trash-can", "text-danger")
        i.type = "button"
        td.appendChild(i)
        return td
    }
    tr.append(
        appendTd(tarih),
        appendTd(alan),
        appendTd(miktar),
        createLastTd()
    )

    harcamaBody.append(tr)

}


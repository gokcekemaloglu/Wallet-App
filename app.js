//^ Selectors

const ekleBtn = document.getElementById("ekle-btn")
const gelirInput = document.getElementById("gelir-input")
const ekleFormu = document.getElementById("ekle-formu")
const temizleBtn = document.getElementById("temizle-btn")

//^ Hesap Tablosu

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

//? Ekle Formu Gelirler

ekleFormu.addEventListener("submit", (e) => {
    e.preventDefault()
    gelirler = gelirler + Number(gelirInput.value)
    console.log(gelirler)
    ekleFormu.reset()
    localStorage.setItem("Gelirler", gelirler)
    gelirinizTd.textContent = new Intl.NumberFormat().format(gelirler)

    hesapla()

})

//^ Windows update

window.addEventListener("load",()=>{
    gelirler = Number(localStorage.getItem("gelirler")) || 0    
    tarihInput.valueAsDate = new Date()
    harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || []
    harcamaListesi.forEach((harcama) => harcamaYaz(harcama))
    hesapla()
})

//^ Harcama Girişi

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
    hesapla()
})

//^ Harcamanın DOM'a yazılması

const harcamaYaz = ({id, tarih, miktar, alan}) => {

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
        i.className = "fa-solid fa-trash-can text-danger"
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

    // harcamaBody.append(tr) // sona ekler
    harcamaBody.prepend(tr) // üste ekler

}

//^ DOM'daki gelir gider hesapları

const hesapla = () =>{
    const giderler = harcamaListesi.reduce((toplam, harcama) => toplam + Number(harcama.miktar), 0)

    giderinizTd.textContent = new Intl.NumberFormat().format(giderler)
    gelirinizTd.textContent = new Intl.NumberFormat().format(gelirler)
    kalanTd.textContent = new Intl.NumberFormat().format(gelirler - giderler)

    const borclu = gelirler - giderler < 0

    kalanTd.classList.toggle("text-danger", borclu)
    document.getElementById("kalanTh").classList.toggle("text-danger", borclu)
}

//^ trascan'a basılınca satır silme

harcamaBody.addEventListener("click", (e) => {
    if (e.target.contains("fa-trash-can")) {
        e.target.parentElement.parentElement.remove()

        const id = e.target.id
        harcamaListesi = harcamaListesi.filter((harcama)=> harcama.id !== id)

        localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))
        
        hesapla()
    }
})

//^ Bilgileri temizleme

temizleBtn.addEventListener("click", () => {
    if (confirm("Tüm bilgileri silmek istediğinize emin misiniz? ")) {
        harcamaListesi = []
        gelirler = 0 
        harcamaBody.innerHTML = ""
        localStorage.removeItem("gelirler")
        localStorage.removeItem("harcamalar")
    }
})





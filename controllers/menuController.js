const Menu = require("../models/MenuModel");

const sample_menus = [
    {
        img: "https://majestycoffee.com/cdn/shop/articles/americano_b74a8154-454b-4f74-9a6c-95fbc4152ed3.jpg",
        title: "Americano",
        description: "A bold and rich coffee made with espresso and hot water.",
        price: "$3.50"
    },
    {
        img: "https://hoxtoncoffee.com/cdn/shop/articles/latte-art-on-mocha_1200x1200.jpg",
        title: "Mocha",
        description: "A delicious blend of espresso, chocolate, and steamed milk.",
        price: "$4.00"
    },
    {
        img: "https://majestycoffee.com/cdn/shop/articles/wet_cappuccino.jpg",
        title: "Cappuccino",
        description: "A classic Italian coffee with steamed milk foam.",
        price: "$3.75"
    },
    {
        img: "https://www.fantescoffee.com/cdn/shop/products/espresso.jpg",
        title: "Espresso",
        description: "A shot of pure espresso, strong and intense.",
        price: "$2.50"
    }
];

module.exports.menuGet = async function (req, res) {
    let query = { isDeleted: false }; // Default query for regular users

    // Check if the user is an admin
    if (res.locals.user && res.locals.user.role === "admin") {
        query = {}; // No filtering by `isDeleted` for admin
    }

    try {
        let menus = await Menu.find(query);
        res.render("menu", { page_title: "Menu", menu: menus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.menuPost = async function (req, res) {
    let name = req.body.name;
    let price = req.body.price;
    let img = req.body.img;
    let description = req.body.description;
    menu = new Menu({
        name, price, img, description
    })
    try{
        menu = await menu.save();
        res.status(201).json({
            menu
        })
    } catch(err) {
        res.json({
            errors: err.message
        })
    }
}

module.exports.addMenu = async function (req, res) {
    res.render("add-menu", { page_title: "Add Menu" })
}

module.exports.searchMenu = async function (req, res) {
    let keyword = req.query.keyword;
    if(keyword == "") {
        res.redirect("/menu");
        return;
    }
    let menus = await Menu.find({"name": {"$regex": keyword, "$options": "i"}});
    res.render("partials/selection-section", {selection:menus}, (err,html) => {
        if(err) {
            res.status(500).json({
                "error": "Something went wrong"
            }
        )
        return;
        }
        res.status(200).json({
            html
        })
    })
}

module.exports.viewMenu = async function (req, res) {
    let menuId = req.params.id;
    try{
        let menu = await Menu.findById(menuId);
        if(!menu) {
            return res.status(404).json({
                message: "Menu not found"
            });
        } res.render("menu-details", { page_title: menu.name, menu}); 
    }catch(err) {
        res.status(500).json({
            error: err.message
        });
    }
}

module.exports.updateMenu = async function(req, res){
    let { id } = req.params;
    //let menu = await Menu.findById(id);
    let update_data = req.body;
    let valid_fields = Object.keys(Menu.schema.paths).filter(field => field != "_id" && field != "__v");
    update_data = Object.fromEntries(
        Object.entries(update_data).filter(f => valid_fields.includes(f[0]))
    );
    let menu = await Menu.findByIdAndUpdate(id, update_data, {new: true, runValidators: true});
    if(!menu) {
        res.status(404).json({
            errors:[
                { menu: "Not found"}
            ]
        })
        return;
    }
    res.status(200).json({
        menu
    })
}

module.exports.updateMenuGet = async function (req, res) {
    let { id } = req.params;
    let menu = await Menu.findById(id);
    if(!menu) {
        res.status(404).json({
            error: "Not Found"
        })
        return;
    }
    res.render("menu-update", { page_title: "Update Menu", menu})
}

module.exports.deleteMenu = async function (req, res) {
    let { id } = req.params;
    let menu = await Menu.findByIdAndDelete(id)
    .then(()=>{
        res.status(200).json({
            data: "Data deleted successfully"
        })
    }).catch(err=>{
        res.status(500).json({
            errors: [{
                menu: "Something went wrong"
            }]
        })
    })
}

module.exports.softDeleteMenu = async function (req, res) {
    let { id } = req.params;
    try{
        let menu = await Menu.findByIdAndUpdate(id, { isDeleted: true})
        res.status(200).json({
            data: "Data Deleted Successfully"
        })
    }catch(err) {
        console.log(err)
        res.status(500).json({
            errors:[
                {menu: "Cannot delete"}
            ]
        })
    }
}
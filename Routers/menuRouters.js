const express = require("express");

const menuController = require("../controllers/menuController");

const { authenticated, adminOnly, injectUser } = require("../middlewares/middleware");

const menuRouter = express.Router();

menuRouter.use(authenticated);

menuRouter.get("/menu", injectUser ,menuController.menuGet);

menuRouter.post("/menu", menuController.menuPost);

menuRouter.get("/add-menu", adminOnly , menuController.addMenu);

menuRouter.get("/find-menu", menuController.searchMenu);

menuRouter.get("/menu/:id/details", menuController.viewMenu);

menuRouter.put("/menu/:id", adminOnly, menuController.updateMenu);

menuRouter.get("/menu/:id/update", adminOnly, menuController.updateMenuGet);

menuRouter.delete("/menu/:id", adminOnly, menuController.deleteMenu);

menuRouter.delete("/menu/:id/delete", adminOnly, menuController.softDeleteMenu);

module.exports = menuRouter;
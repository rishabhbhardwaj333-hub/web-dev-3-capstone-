require("dotenv").config();
const mongoose=require("mongoose");
const User=require("./models/User");
const Category=require("./models/Category");
const Product=require("./models/Product");
(async()=>{
 try{
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({email:{$in:["admin@example.com","seller@example.com","customer@example.com"]}});
  await Category.deleteMany({name:{$in:["Electronics","Stationery","Home"]}});
  const [admin,seller,customer]=await User.create([
   {name:"Demo Admin",email:"admin@example.com",password:"AdminPass123!",role:"admin"},
   {name:"Demo Seller",email:"seller@example.com",password:"SellerPass123!",role:"seller"},
   {name:"Demo Customer",email:"customer@example.com",password:"CustomerPass123!",role:"customer"}
  ]);
  const cats=await Category.create([{name:"Electronics"},{name:"Stationery"},{name:"Home"}]);
  await Product.deleteMany({seller:seller._id});
  await Product.create([
   {name:"Wireless Mouse",description:"USB wireless mouse",price:599,category:cats[0]._id,seller:seller._id,stock:25,lowStockThreshold:5,sku:"ELE-MOU-001"},
   {name:"Keyboard",description:"Compact keyboard",price:999,category:cats[0]._id,seller:seller._id,stock:3,lowStockThreshold:5,sku:"ELE-KEY-002"},
   {name:"Gel Pen Pack",description:"Pack of ten blue pens",price:120,category:cats[1]._id,seller:seller._id,stock:50,lowStockThreshold:10,sku:"STA-PEN-003"},
   {name:"Desk Lamp",description:"LED study lamp",price:799,category:cats[2]._id,seller:seller._id,stock:12,lowStockThreshold:4,sku:"HOM-LAM-004"}
  ]);
  console.log("Seed complete. Demo logins:");
  console.log("admin@example.com / AdminPass123!");
  console.log("seller@example.com / SellerPass123!");
  console.log("customer@example.com / CustomerPass123!");
 }catch(e){console.error(e);}finally{await mongoose.disconnect();}
})();
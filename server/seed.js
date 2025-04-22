const {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProduct,
    createFavorite,
    fetchFavorite,
    destroyFavorite,
  } = require("./db");

  const seed = async () => {
    await client.connect();
  
    await createTables();
    console.log("tables created");
  
    const [Scott, Herb, Mike, GolfCart, Razor, DuneBuggy] = await Promise.all([
      createUser("Scott", "abc123"),
      createUser("Herb", "somePassword"),
      createUser("Mike", "123456"),
      createProduct("GolfCart"),
      createProduct("Razor"),
      createProduct("DuneBuggy"),
    ]);
  
    console.log("users created");
    console.log(await fetchUsers());
  
    console.log("Products created");
    console.log(await fetchProduct());
  
    const [Favorite] = await Promise.all([
      createFavorite(Scott.id, GolfCart.id),
      createFavorite(Herb.id, Razor.id),
      createFavorite(Mike.id, DuneBuggy.id),
    ]);
  
    console.log("Favorite created");
    console.log(await fetchFavorite(Scott.id));
  
    await destroyFavorite(Favorite.id, Scott.id);
  
    console.log("after deleting product");
    console.log(await fetchUserProduct(Scott.id));
  
    await client.end();
  };
  
  seed();
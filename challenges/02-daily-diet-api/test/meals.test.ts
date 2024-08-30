import { it, expect, describe } from "vitest";
import requestSupertest from "supertest";

import { app } from "../src/app";

const userData = {
  name: "John Doe",
  email: "johndoe@example.com",
  password: "Password123@",
};

const mealData = {
  name: "Batata doce e frango",
  description: "Refeição pra ficar monstro",
  isMealOnDietPlan: true,
};

const mealDataUpdate = {
  name: "Macarronada",
  description: "Almoço no restaurante",
  isMealOnDietPlan: false,
};

describe("meals routes", () => {
  it("should CREATE a new meal", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const createMealResponse = await requestSupertest(app.server)
      .post("/meals")
      .set("Cookie", sessionIdInCookies)
      .send(mealData);

    expect(createMealResponse.statusCode).toEqual(201);
    expect(createMealResponse.body).toHaveProperty("meal");
  });

  it("should GET all logged user's meals", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    await requestSupertest(app.server)
      .post("/meals")
      .set("Cookie", sessionIdInCookies)
      .send(mealData);

    const getMealsResponse = await requestSupertest(app.server)
      .get("/meals")
      .set("Cookie", sessionIdInCookies);

    expect(getMealsResponse.statusCode).toEqual(200);
    expect(getMealsResponse.body).toHaveProperty("userMeals");
  });

  it("should GET specific meal by ID", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const createMealResponse = await requestSupertest(app.server)
      .post("/meals")
      .set("Cookie", sessionIdInCookies)
      .send(mealData);

    const { id } = createMealResponse.body.meal;

    const getMealResponse = await requestSupertest(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", sessionIdInCookies);

    expect(getMealResponse.statusCode).toEqual(200);
    expect(getMealResponse.body).toHaveProperty("userMeal");
  });

  it("should UPDATE specific meal by ID", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const createMealResponse = await requestSupertest(app.server)
      .post("/meals")
      .set("Cookie", sessionIdInCookies)
      .send(mealData);

    const { id } = createMealResponse.body.meal;

    const updateMealResponse = await requestSupertest(app.server)
      .put(`/meals/${id}`)
      .set("Cookie", sessionIdInCookies)
      .send(mealDataUpdate);

    const test = updateMealResponse.body;
    console.log(test);

    expect(updateMealResponse.statusCode).toEqual(200);
  });

  it("should DELETE specific meal by ID", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const createMealResponse = await requestSupertest(app.server)
      .post("/meals")
      .set("Cookie", sessionIdInCookies)
      .send(mealData);

    const { id } = createMealResponse.body.meal;

    const deleteMealResponse = await requestSupertest(app.server)
      .delete(`/meals/${id}`)
      .set("Cookie", sessionIdInCookies);

    expect(deleteMealResponse.statusCode).toEqual(200);
  });
});

import { it, expect, beforeEach, beforeAll, afterAll, describe } from "vitest";
import { execSync } from "node:child_process";
import requestSupertest from "supertest";

import { app } from "../src/app";

const userData = {
  name: "John Doe",
  email: "johndoe@example.com",
  password: "Password123@",
};

const userDataUpdate = {
  name: "John",
  email: "john@example.com",
  oldPassword: "Password123@",
  password: "@321Password",
};

describe("user routes", () => {
  it("should CREATE a new user", async () => {
    const response = await requestSupertest(app.server)
      .post("/user")
      .send(userData);
    expect(response.statusCode).toEqual(201);
    expect(response.body.user).toHaveProperty("id");
  });

  it("should LOGIN user", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const cookies = loginResponse.get("Set-Cookie") ?? [];
    const hasSessionIdCookie = cookies.some((cookie) =>
      cookie.startsWith("sessionId=")
    );

    expect(loginResponse.statusCode).toEqual(200);
    expect(hasSessionIdCookie).toBe(true);
  });

  it("should GET logged user metrics", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const userMetricsResponse = await requestSupertest(app.server)
      .get("/user/metrics")
      .set("Cookie", sessionIdInCookies);

    expect(userMetricsResponse.statusCode).toEqual(200);
    expect(userMetricsResponse.body).toHaveProperty("totalMeals");
    expect(userMetricsResponse.body).toHaveProperty("mealsOnDiet");
    expect(userMetricsResponse.body).toHaveProperty("mealsOffDiet");
    expect(userMetricsResponse.body).toHaveProperty("maxSequenceOnDiet");
  });

  it("should GET logged user data", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const userResponse = await requestSupertest(app.server)
      .get("/user")
      .set("Cookie", sessionIdInCookies);

    expect(userResponse.statusCode).toEqual(200);
    expect(userResponse.body).toHaveProperty("userDataWithoutPassword");
  });

  it("should DELETE logged user data", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    const userResponse = await requestSupertest(app.server)
      .delete("/user")
      .set("Cookie", sessionIdInCookies);

    expect(userResponse.statusCode).toEqual(200);
  });

  it("should UPDATE logged user data", async () => {
    await requestSupertest(app.server).post("/user").send(userData);

    const loginResponse = await requestSupertest(app.server)
      .post("/user/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    const sessionIdInCookies = loginResponse.get("Set-Cookie") ?? [];

    /*const sessionIdInDatabase = loginResponse.body.user.sessionId;
    console.log({
      sessionIdInDatabase,
      sessionIdInCookies,
    });*/ //decidi manter o código aqui, para testes futuros

    const userResponse = await requestSupertest(app.server)
      .put("/user")
      .set("Cookie", sessionIdInCookies)
      .send(userDataUpdate);

    expect(userResponse.statusCode).toEqual(200);
  });
});

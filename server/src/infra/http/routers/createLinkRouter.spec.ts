import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import {
  EXAMPLE_ORIGINAL_URL,
  EXAMPLE_SHORT_URL,
  LINK_DELETED_SUCCESSFULLY_MESSAGE,
  LINK_NOT_FOUND_MESSAGE,
  SHORT_URL_VALIDATION_MESSAGE,
  SHORT_URL_ALREADY_EXISTS_MESSAGE,
} from "./link.constants";

const DEFAULT_ORIGINAL_URL = EXAMPLE_ORIGINAL_URL;
const DEFAULT_ORIGINAL_URL_WITHOUT_TRAILING_SLASH =
  "https://www.rocketseat.com.br";
const DEFAULT_SHORT_URL = EXAMPLE_SHORT_URL;
const SECOND_SHORT_URL = "rocketseat";
const SHORT_URL_NOT_FOUND = "not-found";

const {
  mockFindByShortUrl,
  mockListAll,
  mockCreate,
  mockIncrementAccessById,
  mockDeleteById,
} = vi.hoisted(() => {
  const mockFindByShortUrl = vi.fn();
  const mockListAll = vi.fn();
  const mockCreate = vi.fn();
  const mockIncrementAccessById = vi.fn();
  const mockDeleteById = vi.fn();

  return {
    mockFindByShortUrl,
    mockListAll,
    mockCreate,
    mockIncrementAccessById,
    mockDeleteById,
  };
});

vi.mock("../../services/linkService", () => ({
  linkService: {
    findByShortUrl: mockFindByShortUrl,
    listAll: mockListAll,
    create: mockCreate,
    incrementAccessById: mockIncrementAccessById,
    deleteById: mockDeleteById,
  },
}));

import { linkRouter } from "./linkRouter";

describe("create link router", () => {
  const app = fastify();

  beforeAll(async () => {
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    await app.register(linkRouter);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a link and return 201", async () => {
    const createdAt = new Date("2026-03-02T00:00:00.000Z");

    mockFindByShortUrl.mockResolvedValueOnce(undefined);

    mockCreate.mockResolvedValueOnce({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
      accessCount: "0",
      createdAt,
    });

    const response = await app.inject({
      method: "POST",
      url: "/links",
      payload: {
        originalUrl: DEFAULT_ORIGINAL_URL,
        shortUrl: DEFAULT_SHORT_URL,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith({
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
    });

    expect(response.json()).toEqual({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
      accessCount: "0",
      createdAt: createdAt.toISOString(),
    });
  });

  it("should return 409 when short url already exists", async () => {
    const createdAt = new Date("2026-03-02T00:00:00.000Z");

    mockFindByShortUrl.mockResolvedValueOnce({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
      accessCount: "10",
      createdAt,
    });

    const response = await app.inject({
      method: "POST",
      url: "/links",
      payload: {
        originalUrl: DEFAULT_ORIGINAL_URL_WITHOUT_TRAILING_SLASH,
        shortUrl: DEFAULT_SHORT_URL,
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: SHORT_URL_ALREADY_EXISTS_MESSAGE,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return 400 when short url is invalid", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/links",
      payload: {
        originalUrl: DEFAULT_ORIGINAL_URL,
        shortUrl: "Portfolio Dev",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toContain("body/shortUrl");
    expect(response.json().message).toContain(SHORT_URL_VALIDATION_MESSAGE);
    expect(response.body).toContain(SHORT_URL_VALIDATION_MESSAGE);
    expect(mockFindByShortUrl).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return original url by short url and return 200", async () => {
    const createdAt = new Date("2026-03-02T00:00:00.000Z");

    mockFindByShortUrl.mockResolvedValueOnce({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
      accessCount: "10",
      createdAt,
    });

    const response = await app.inject({
      method: "GET",
      url: `/links/original-url?shortUrl=${DEFAULT_SHORT_URL}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
    });
  });

  it("should return 404 when short url does not exist", async () => {
    mockFindByShortUrl.mockResolvedValueOnce(undefined);

    const response = await app.inject({
      method: "GET",
      url: `/links/original-url?shortUrl=${SHORT_URL_NOT_FOUND}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ message: LINK_NOT_FOUND_MESSAGE });
  });

  it("should list all links and return 200", async () => {
    const createdAt = new Date("2026-03-02T00:00:00.000Z");

    mockListAll.mockResolvedValueOnce([
      {
        id: "id-1",
        originalUrl: DEFAULT_ORIGINAL_URL,
        shortUrl: DEFAULT_SHORT_URL,
        accessCount: "30",
        createdAt,
      },
      {
        id: "id-2",
        originalUrl: DEFAULT_ORIGINAL_URL_WITHOUT_TRAILING_SLASH,
        shortUrl: SECOND_SHORT_URL,
        accessCount: "10",
        createdAt,
      },
    ]);

    const response = await app.inject({
      method: "GET",
      url: "/links",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        id: "id-1",
        originalUrl: DEFAULT_ORIGINAL_URL,
        shortUrl: DEFAULT_SHORT_URL,
        accessCount: "30",
        createdAt: createdAt.toISOString(),
      },
      {
        id: "id-2",
        originalUrl: DEFAULT_ORIGINAL_URL_WITHOUT_TRAILING_SLASH,
        shortUrl: SECOND_SHORT_URL,
        accessCount: "10",
        createdAt: createdAt.toISOString(),
      },
    ]);
  });

  it("should return an empty array when there are no links", async () => {
    mockListAll.mockResolvedValueOnce([]);

    const response = await app.inject({
      method: "GET",
      url: "/links",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it("should export links as csv", async () => {
    const createdAt = new Date("2026-03-02T00:00:00.000Z");

    mockListAll.mockResolvedValueOnce([
      {
        id: "id-1",
        originalUrl: DEFAULT_ORIGINAL_URL,
        shortUrl: DEFAULT_SHORT_URL,
        accessCount: "30",
        createdAt,
      },
    ]);

    const response = await app.inject({
      method: "GET",
      url: "/links/export/csv",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/csv");
    expect(response.headers["content-disposition"]).toContain("links.csv");
    expect(response.body).toContain(
      "id,original_url,short_url,access_count,created_at",
    );
    expect(response.body).toContain("id-1");
    expect(response.body).toContain(DEFAULT_ORIGINAL_URL);
    expect(response.body).toContain(DEFAULT_SHORT_URL);
  });

  it("should increment access count by id and return 200", async () => {
    const createdAt = new Date("2026-03-02T00:00:00.000Z");

    mockIncrementAccessById.mockResolvedValueOnce({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
      accessCount: "31",
      createdAt,
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/links/id-1/access",
    });

    expect(response.statusCode).toBe(200);
    expect(mockIncrementAccessById).toHaveBeenCalledTimes(1);
    expect(response.json()).toEqual({
      id: "id-1",
      originalUrl: DEFAULT_ORIGINAL_URL,
      shortUrl: DEFAULT_SHORT_URL,
      accessCount: "31",
      createdAt: createdAt.toISOString(),
    });
  });

  it("should return 404 when link does not exist while incrementing access", async () => {
    mockIncrementAccessById.mockResolvedValueOnce(undefined);

    const response = await app.inject({
      method: "PATCH",
      url: "/links/not-found/access",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ message: LINK_NOT_FOUND_MESSAGE });
  });

  it("should delete a link by id and return 200", async () => {
    mockDeleteById.mockResolvedValueOnce(true);

    const response = await app.inject({
      method: "DELETE",
      url: "/links/id-1",
    });

    expect(response.statusCode).toBe(200);
    expect(mockDeleteById).toHaveBeenCalledTimes(1);
    expect(response.json()).toEqual({
      message: LINK_DELETED_SUCCESSFULLY_MESSAGE,
    });
  });

  it("should return 404 when deleting a non-existent link", async () => {
    mockDeleteById.mockResolvedValueOnce(false);

    const response = await app.inject({
      method: "DELETE",
      url: "/links/not-found",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ message: LINK_NOT_FOUND_MESSAGE });
  });
});

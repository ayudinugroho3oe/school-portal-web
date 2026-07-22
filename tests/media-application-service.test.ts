import { describe, expect, it, vi } from "vitest";
import { MediaApplicationService } from "@/modules/media/application/service";
import type { MediaAssetRepository } from "@/modules/media/domain/repository";
import type { MediaStorage } from "@/modules/media/domain/storage";

const schoolId = "11111111-1111-4111-8111-111111111111";
const actor = { id: "22222222-2222-4222-8222-222222222222", role: "SCHOOL_ADMIN" as const };
const bytes = Uint8Array.from([0xff,0xd8,0xff,0xdb]);

function setup(overrides: Partial<MediaAssetRepository> = {}) {
  const repository = {
    list: vi.fn().mockResolvedValue([]), findById: vi.fn(), findByChecksum: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation(async (_schoolId, input) => ({ ...input, createdAt: new Date(), updatedAt: new Date() })),
    updateMetadata: vi.fn(), setStatus: vi.fn(), ...overrides,
  } as MediaAssetRepository;
  const storage = { provider: "TEST", upload: vi.fn(), delete: vi.fn(), exists: vi.fn(), metadata: vi.fn(), resolveUrl: vi.fn() } as unknown as MediaStorage;
  const resolver = { resolveActiveSchoolId: vi.fn().mockResolvedValue(schoolId) };
  return { repository, storage, resolver, service: new MediaApplicationService(repository, storage, resolver) };
}

describe("media application service", () => {
  it("authorizes before repository or storage access", async () => {
    const state = setup();
    await expect(state.service.upload({ ...actor, role: "STAFF" }, "req", { filename: "a.jpg", declaredMimeType: "image/jpeg", bytes })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(state.repository.findByChecksum).not.toHaveBeenCalled(); expect(state.storage.upload).not.toHaveBeenCalled();
  });
  it("uploads with canonical School scope", async () => {
    const state = setup();
    const asset = await state.service.upload(actor, "req", { filename: "kelas.jpg", declaredMimeType: "image/jpeg", bytes });
    expect(state.storage.upload).toHaveBeenCalledOnce(); expect(state.repository.create).toHaveBeenCalledWith(schoolId, expect.objectContaining({ schoolId, status: "ACTIVE" }));
    expect(asset.schoolId).toBe(schoolId);
  });
  it("does not write metadata when storage fails", async () => {
    const state = setup(); vi.mocked(state.storage.upload).mockRejectedValue(new Error("storage unavailable"));
    await expect(state.service.upload(actor, "req", { filename: "a.jpg", declaredMimeType: "image/jpeg", bytes })).rejects.toThrow();
    expect(state.repository.create).not.toHaveBeenCalled();
  });
  it("deletes the stored object when database creation fails", async () => {
    const state = setup({ create: vi.fn().mockRejectedValue(new Error("database unavailable")) });
    await expect(state.service.upload(actor, "req", { filename: "a.jpg", declaredMimeType: "image/jpeg", bytes })).rejects.toThrow("database unavailable");
    expect(state.storage.delete).toHaveBeenCalledOnce();
  });
  it("rejects duplicates before upload", async () => {
    const state = setup({ findByChecksum: vi.fn().mockResolvedValue({ id: "existing" }) as never });
    await expect(state.service.upload(actor, "req", { filename: "a.jpg", declaredMimeType: "image/jpeg", bytes })).rejects.toMatchObject({ code: "DUPLICATE_MEDIA" });
    expect(state.storage.upload).not.toHaveBeenCalled();
  });
});

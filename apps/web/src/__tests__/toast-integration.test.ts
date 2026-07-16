import { toastSuccess, toastError, toastWarning, toastInfo } from "@/lib/toast";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

import { toast } from "sonner";

describe("toast utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("toastSuccess calls toast.success", () => {
    toastSuccess("It worked!");
    expect(toast.success).toHaveBeenCalledWith("It worked!");
  });

  it("toastError calls toast.error", () => {
    toastError("Something broke");
    expect(toast.error).toHaveBeenCalledWith("Something broke");
  });

  it("toastWarning calls toast.warning", () => {
    toastWarning("Be careful");
    expect(toast.warning).toHaveBeenCalledWith("Be careful");
  });

  it("toastInfo calls toast.info", () => {
    toastInfo("FYI");
    expect(toast.info).toHaveBeenCalledWith("FYI");
  });
});

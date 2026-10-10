import { renderHook, act } from "@testing-library/react-native";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  jest.useFakeTimers();

  test("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("a", 500));
    expect(result.current).toBe("a");
  });

  test("updates only after the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "g" } },
    );
    expect(result.current).toBe("g");
    rerender({ value: "gr" });
    expect(result.current).toBe("g");
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe("g");
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("gr");
  });
});
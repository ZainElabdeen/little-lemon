import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import Home from "./Home";

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (cb: () => void | (() => void)) => {
      React.useEffect(cb, [cb]);
    },
  };
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    multiGet: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("@/utils/db", () => ({
  initMenuDb: jest.fn().mockResolvedValue(undefined),
  isMenuEmpty: jest.fn().mockResolvedValue(true),
  saveMenuItems: jest.fn().mockResolvedValue(undefined),
  getCategories: jest.fn().mockResolvedValue(["starters", "mains"]),
  filterMenuItems: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: "Greek Salad",
      description: "d",
      price: 12.99,
      image: "greekSalad.jpg",
      category: "starters",
    },
  ]),
}));

jest.mock("@/utils/api", () => ({
  fetchMenu: jest.fn().mockResolvedValue([
    {
      name: "Greek Salad",
      description: "d",
      price: 12.99,
      image: "greekSalad.jpg",
      category: "starters",
    },
  ]),
  menuItemImageUrl: jest.fn().mockReturnValue("https://example.com/greekSalad.jpg"),
}));

import { fetchMenu } from "@/utils/api";
import { filterMenuItems, isMenuEmpty, saveMenuItems } from "@/utils/db";

const menuEmptyMock = isMenuEmpty as jest.Mock;
const filterMock = filterMenuItems as jest.Mock;
const saveMock = saveMenuItems as jest.Mock;
const fetchMock = fetchMenu as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

test("seeds from the API when the DB is empty", async () => {
  menuEmptyMock.mockResolvedValue(true);
  render(<Home />);
  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });
});

test("does not fetch from the API when the DB has data", async () => {
  menuEmptyMock.mockResolvedValue(false);
  render(<Home />);
  await waitFor(() => {
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

test("clears items when a filter returns an empty list", async () => {
  menuEmptyMock.mockResolvedValue(true);
  filterMock.mockResolvedValueOnce([
    {
      id: 1,
      name: "Greek Salad",
      description: "d",
      price: 12.99,
      image: "greekSalad.jpg",
      category: "starters",
    },
  ]);
  filterMock.mockResolvedValueOnce([]);
  const { getByPlaceholderText, getByText } = render(<Home />);
  await act(async () => {});
  fireEvent.changeText(getByPlaceholderText("Search for dishes…"), "zzz");
  await waitFor(() => {
    expect(getByText("No items match your search.")).toBeTruthy();
  });
});

test("avatar fallback uses Profile.png when no stored avatar and press opens profile", async () => {
  menuEmptyMock.mockResolvedValue(true);
  const onOpenProfile = jest.fn();
  const { getByLabelText, getByTestId } = render(
    <Home onOpenProfile={onOpenProfile} />,
  );
  await act(async () => {});
  expect(getByTestId("home-avatar").props.source).toBe(
    require("@/assets/images/Profile.png"),
  );
  fireEvent.press(getByLabelText("Open profile"));
  expect(onOpenProfile).toHaveBeenCalledTimes(1);
});

test("uses the stored avatarUri once it resolves", async () => {
  menuEmptyMock.mockResolvedValue(true);
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
    "file:///avatar.jpg",
  );
  const { getByTestId } = render(<Home />);
  await act(async () => {});
  await waitFor(() => {
    expect(getByTestId("home-avatar").props.source).toEqual({
      uri: "file:///avatar.jpg",
    });
  });
});
import { Clipboard, environment, Icon, MenuBarExtra, openCommandPreferences, showHUD } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { HistoryItem } from "./types";
import { getHex, getIcon, getShortcut, MAX_HISTORY_LENGTH, pickColor } from "./utils";

export default function Command() {
  const [history, setHistory] = useCachedState<HistoryItem[]>("history", []);

  return (
    <MenuBarExtra icon={Icon.EyeDropper}>
      <MenuBarExtra.Item
        title="Pick Color"
        onAction={async () => {
          const pickedColor = await pickColor();
          if (!pickedColor) {
            return;
          }

          const hex = getHex(pickedColor);
          await Clipboard.copy(hex);
          await showHUD(`Copied to clipboard`);

          setHistory((previousHistory) => {
            return [
              { date: new Date().toUTCString(), color: pickedColor },
              ...previousHistory.filter((item) => getHex(item.color) !== getHex(pickedColor)),
            ].slice(0, MAX_HISTORY_LENGTH);
          });
        }}
      />
      <MenuBarExtra.Section>
        {history?.slice(0, 9).map((historyItem, index) => {
          const hex = getHex(historyItem.color);
          return (
            <MenuBarExtra.Item
              key={hex}
              icon={getIcon(hex)}
              title={hex}
              shortcut={getShortcut(index)}
              onAction={() => Clipboard.copy(hex)}
            />
          );
        })}
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Configure Command"
          shortcut={{ modifiers: ["cmd"], key: "," }}
          onAction={openCommandPreferences}
        />
        {environment.isDevelopment && (
          <MenuBarExtra.Item
            title="Clear Cached State"
            onAction={() => {
              setHistory([]);
            }}
          />
        )}
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

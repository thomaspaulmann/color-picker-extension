import { Action, ActionPanel, Grid } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { HistoryItem } from "./types";
import { getHex } from "./utils";

export default function Command() {
  const [history] = useCachedState<HistoryItem[]>("history");

  return (
    <Grid>
      {history?.map((historyItem) => {
        const hex = getHex(historyItem.color);
        return (
          <Grid.Item
            key={hex}
            content={{ color: hex }}
            title={hex}
            subtitle={new Date(historyItem.date).toLocaleString()}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={hex} />
              </ActionPanel>
            }
          />
        );
      })}
    </Grid>
  );
}

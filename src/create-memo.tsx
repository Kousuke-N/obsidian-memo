import { Form, ActionPanel, Action, showToast, Toast, closeMainWindow, PopToRootType } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { useState } from "react";

const execPromise = promisify(exec);

type Values = {
  memo: string
};

export default function Command() {
  async function handleSubmit(values: Values) {
    try {
      const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
      const encodedMemo = encodeURIComponent(values.memo);

      const obsidianUrl = `obsidian://advanced-uri?vault=Private&daily=true&mode=append&data=-%20${currentTime}%20${encodedMemo}`;

      await execPromise(`open --background "${obsidianUrl}"`);

      showToast({ title: "メモを追加しました", message: values.memo });
      closeMainWindow({
        clearRootSearch: true,
        popToRootType: PopToRootType.Immediate
      });
    } catch (error) {
      console.error(error);
      showToast({ title: "エラーが発生しました", style: Toast.Style.Failure });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="memo" title="メモ" placeholder="メモを入力してください" />
    </Form>
  );
}

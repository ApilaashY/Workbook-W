import { speechDialog } from "@/lib/Components/Dialogs/SpeechDialog";

export async function getSpeechInput(): Promise<string> {
  const result = await speechDialog();
  return result || "";
}
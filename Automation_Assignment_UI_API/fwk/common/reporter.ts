
export class Reporter {
  async log(message: string): Promise<void> {
    console.log(`[LOG]: ${message}`);
  }
}

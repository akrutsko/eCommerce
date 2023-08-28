interface Observer {
  update(primaryData?: string, secondaryData?: string, search?: string): void;
}

export interface Snippet {
  id: string;
  label: string;
  description: string;
  category: string;
  insertText: string;
  library?: string;
}

export interface SnippetCategory {
  id: string;
  name: string;
  icon: string;
  snippets: Snippet[];
}

export const snippetCategories: SnippetCategory[] = [
  {
    id: 'desktop',
    name: 'Desktop Automation',
    icon: '🖥️',
    snippets: [
      {
        id: 'open_application',
        label: 'Open Application',
        description: 'Start a desktop application',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'app_id = desktop.open_application(executable="/path/to/app.exe")',
      },
      {
        id: 'wait_for_window',
        label: 'Wait For Window',
        description: 'Wait for a window to appear',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'window_id = desktop.wait_for_window(title="Window Title", timeout="30s")',
      },
      {
        id: 'click_element',
        label: 'Click Element',
        description: 'Click on a UI element',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'desktop.click_element(selector="auto:Button")',
      },
      {
        id: 'input_text',
        label: 'Input Text',
        description: 'Type text into an element',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'desktop.input_text(selector="auto:TextField", text="your text", clear=True)',
      },
      {
        id: 'press_keys',
        label: 'Press Keys',
        description: 'Send keyboard shortcuts',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'desktop.press_keys(keys="{CTRL}A")',
      },
      {
        id: 'get_element_text',
        label: 'Get Element Text',
        description: 'Get text from an element',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'text = desktop.get_element_text(selector="auto:Label")',
      },
      {
        id: 'wait_until_element',
        label: 'Wait Until Element',
        description: 'Wait for element to exist',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'desktop.wait_until_element_exists(selector="auto:Element", timeout="30s")',
      },
      {
        id: 'close_application',
        label: 'Close Application',
        description: 'Close the application',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'desktop.close_application()',
      },
      {
        id: 'take_screenshot',
        label: 'Take Screenshot',
        description: 'Take a screenshot',
        category: 'Desktop Automation',
        library: 'DesktopUI',
        insertText: 'filename = desktop.take_screenshot(filename="screenshot.png")',
      },
    ],
  },
  {
    id: 'web',
    name: 'Web Automation',
    icon: '🌐',
    snippets: [
      {
        id: 'open_browser',
        label: 'Open Browser',
        description: 'Open a web browser',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'browser_id = web.open_browser(url="https://example.com", browser="chromium")',
      },
      {
        id: 'navigate',
        label: 'Navigate',
        description: 'Navigate to URL',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'web.navigate(url="https://example.com")',
      },
      {
        id: 'click_element',
        label: 'Click Element',
        description: 'Click on a web element',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'web.click_element(selector="button#submit")',
      },
      {
        id: 'input_text',
        label: 'Input Text',
        description: 'Type text into input',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'web.input_text(selector="input[name=email]", text="user@example.com")',
      },
      {
        id: 'get_element_text',
        label: 'Get Element Text',
        description: 'Get text from element',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'text = web.get_element_text(selector="div.result")',
      },
      {
        id: 'wait_for_element',
        label: 'Wait For Element',
        description: 'Wait for element',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'web.wait_for_element(selector="div.loading", state="hidden", timeout="30s")',
      },
      {
        id: 'take_screenshot',
        label: 'Take Screenshot',
        description: 'Take a screenshot',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'filename = web.take_screenshot(filename="screenshot.png")',
      },
      {
        id: 'close_browser',
        label: 'Close Browser',
        description: 'Close the browser',
        category: 'Web Automation',
        library: 'WebUI',
        insertText: 'web.close_browser()',
      },
    ],
  },
  {
    id: 'excel',
    name: 'Excel',
    icon: '📊',
    snippets: [
      {
        id: 'open_workbook',
        label: 'Open Workbook',
        description: 'Open Excel workbook',
        category: 'Excel',
        library: 'Excel',
        insertText: 'path = excel.open_workbook(path="/path/to/workbook.xlsx")',
      },
      {
        id: 'create_workbook',
        label: 'Create Workbook',
        description: 'Create new workbook',
        category: 'Excel',
        library: 'Excel',
        insertText: 'excel.create_workbook()',
      },
      {
        id: 'save_workbook',
        label: 'Save Workbook',
        description: 'Save the workbook',
        category: 'Excel',
        library: 'Excel',
        insertText: 'path = excel.save_workbook(path="/path/to/output.xlsx")',
      },
      {
        id: 'read_cell',
        label: 'Read Cell',
        description: 'Read cell value',
        category: 'Excel',
        library: 'Excel',
        insertText: 'value = excel.read_cell(cell="A1")',
      },
      {
        id: 'write_cell',
        label: 'Write Cell',
        description: 'Write to cell',
        category: 'Excel',
        library: 'Excel',
        insertText: 'excel.write_cell(cell="A1", value="data")',
      },
      {
        id: 'read_range',
        label: 'Read Range',
        description: 'Read cell range',
        category: 'Excel',
        library: 'Excel',
        insertText: 'data = excel.read_range(range_spec="A1:C10")',
      },
      {
        id: 'set_active_sheet',
        label: 'Set Active Sheet',
        description: 'Set worksheet',
        category: 'Excel',
        library: 'Excel',
        insertText: 'excel.set_active_sheet(name="Sheet1")',
      },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    icon: '🗄️',
    snippets: [
      {
        id: 'connect_db',
        label: 'Connect',
        description: 'Connect to database',
        category: 'Database',
        library: 'Database',
        insertText: 'db.connect_to_database(connection_string="sqlite:///mydb.db")',
      },
      {
        id: 'execute_query',
        label: 'Execute Query',
        description: 'Run SELECT query',
        category: 'Database',
        library: 'Database',
        insertText: 'results = db.execute_query(query="SELECT * FROM users")',
      },
      {
        id: 'disconnect_db',
        label: 'Disconnect',
        description: 'Disconnect',
        category: 'Database',
        library: 'Database',
        insertText: 'db.disconnect_from_database()',
      },
    ],
  },
  {
    id: 'credentials',
    name: 'Credentials',
    icon: '🔐',
    snippets: [
      {
        id: 'get_credential',
        label: 'Get Credential',
        description: 'Get stored credentials',
        category: 'Credentials',
        library: 'Credentials',
        insertText: 'creds = creds_manager.get_credential(name="mycredential")',
      },
      {
        id: 'set_credential',
        label: 'Set Credential',
        description: 'Store credentials',
        category: 'Credentials',
        library: 'Credentials',
        insertText: 'creds_manager.set_credential(name="mycredential", username="user", password="pass")',
      },
    ],
  },
  {
    id: 'variables',
    name: 'Variables',
    icon: '📦',
    snippets: [
      {
        id: 'set_variable',
        label: 'Set Variable',
        description: 'Set variable',
        category: 'Variables',
        library: 'Variables',
        insertText: 'vars.set_variable(name="result", value="data")',
      },
      {
        id: 'get_variable',
        label: 'Get Variable',
        description: 'Get variable',
        category: 'Variables',
        library: 'Variables',
        insertText: 'value = vars.get_variable(name="my_var", default=None)',
      },
    ],
  },
  {
    id: 'flow',
    name: 'Flow Control',
    icon: '🔀',
    snippets: [
      {
        id: 'if_statement',
        label: 'If Condition',
        description: 'If statement',
        category: 'Flow Control',
        insertText: 'if condition:\n    pass',
      },
      {
        id: 'for_loop',
        label: 'For Loop',
        description: 'For loop',
        category: 'Flow Control',
        insertText: 'for item in items:\n    pass',
      },
      {
        id: 'while_loop',
        label: 'While Loop',
        description: 'While loop',
        category: 'Flow Control',
        insertText: 'while condition:\n    pass',
      },
    ],
  },
  {
    id: 'ocr',
    name: 'OCR',
    icon: '🔍',
    snippets: [
      {
        id: 'ocr_text',
        label: 'Extract from Image',
        description: 'OCR from image file',
        category: 'OCR',
        library: 'OCR',
        insertText: 'text = ocr.ocr_text_from_image(path="/path/to/image.png")',
      },
      {
        id: 'ocr_screen',
        label: 'Extract from Screen',
        description: 'OCR from screen',
        category: 'OCR',
        library: 'OCR',
        insertText: 'text = ocr.ocr_text_from_screen(timeout="10s")',
      },
    ],
  },
];

export const getSnippetById = (id: string): Snippet | undefined => {
  for (const category of snippetCategories) {
    const snippet = category.snippets.find((s) => s.id === id);
    if (snippet) return snippet;
  }
  return undefined;
};

export const getSnippetsByCategory = (categoryId: string): Snippet[] => {
  const category = snippetCategories.find((c) => c.id === categoryId);
  return category?.snippets || [];
};

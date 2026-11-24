const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Every validator returns an object like { email: 'message' }. An empty object means valid.

export function validateLogin({ email, password }) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

export function validateRegister({ name, email, password }) {
  const errors = {};
  const trimmedName = name.trim();

  if (!trimmedName) errors.name = 'Enter your name.';
  else if (trimmedName.length > 150) errors.name = 'Name must be 150 characters or fewer.';

  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export function validateTodo({ title, description }) {
  const errors = {};
  const trimmedTitle = title.trim();

  if (!trimmedTitle) errors.title = 'Enter a title.';
  else if (trimmedTitle.length > 255) errors.title = 'Title must be 255 characters or fewer.';

  if (description.length > 10000) errors.description = 'Description must be 10,000 characters or fewer.';
  return errors;
}

function hasControlCharacter(text) {
  return [...text].some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

// Same rules as the backend: not blank, 100 characters at most, no control characters.
export function validateTeam({ name }) {
  const errors = {};
  const trimmed = name.trim();

  if (!trimmed) errors.name = 'Enter a team name.';
  else if (trimmed.length > 100) errors.name = 'Team name must be 100 characters or fewer.';
  else if (hasControlCharacter(trimmed)) errors.name = 'Team name cannot contain control characters.';

  return errors;
}
// Same rules as the backend: not blank, 50 characters at most, no control characters.
export function validateCategory({ name }) {
  const errors = {};
  const trimmed = name.trim();

  if (!trimmed) errors.name = 'Enter a category name.';
  else if (trimmed.length > 50) errors.name = 'Category name must be 50 characters or fewer.';
  else if (hasControlCharacter(trimmed)) errors.name = 'Category name cannot contain control characters.';

  return errors;
}


// Same rules as the backend: subject 1-150 chars on one line, message 1-5000 chars.
export function validateBulkEmail({ subject, message }) {
  const errors = {};
  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();

  if (!trimmedSubject) errors.subject = 'Enter a subject.';
  else if (trimmedSubject.length > 150) errors.subject = 'Subject must be 150 characters or fewer.';
  else if (hasControlCharacter(trimmedSubject)) errors.subject = 'Subject cannot contain line breaks or control characters.';

  if (!trimmedMessage) errors.message = 'Enter a message.';
  else if (trimmedMessage.length > 5000) errors.message = 'Message must be 5,000 characters or fewer.';

  return errors;
}
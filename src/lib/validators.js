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
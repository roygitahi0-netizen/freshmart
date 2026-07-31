// Renders the message(s) for one field from a Marshmallow-style
// fieldErrors object: { fieldName: ["msg1", "msg2"] }.
// Usage: <FieldError errors={fieldErrors} field="email" />
export default function FieldError({ errors, field }) {
  const messages = errors?.[field];
  if (!messages) return null;
  const list = Array.isArray(messages) ? messages : [messages];

  return (
    <p className="mt-1.5 text-xs text-tomato">
      {list[0]}
    </p>
  );
}

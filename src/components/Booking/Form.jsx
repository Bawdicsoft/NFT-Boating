import { render } from "react-dom";
import { useForm } from "react-cool-form";

import "./form.scss";

export function Form() {

  const { form, use } = useForm({
    defaultValues: { firstName: "", lastName: "", framework: "" },
    onSubmit: (values) => alert(JSON.stringify(values, undefined, 2))
  });
  const errors = use("errors");

  return (
    <form style={{ padding:'20px'}} ref={form} noValidate>
      <div>
        <input type="text" name="Name" placeholder="name" required />
        {errors.firstName && <p>{errors.firstName}</p>}
      </div>
      <div>
        <input type="email" name="Email" placeholder="email" required />
        {errors.lastName && <p>{errors.lastName}</p>}
      </div>
      <div>
        <input type="phone" name="Phone" placeholder="phone" required />
        {errors.lastName && <p>{errors.lastName}</p>}
      </div>
      <div>
        <input type="date" name="Date of Birth" placeholder="date of birth" required />
        {errors.lastName && <p>{errors.lastName}</p>}
      </div>
      {/* <select name="framework">
        <option value="">I'm interesting in...</option>
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </select> */}
      <input type="submit" />
    </form>
  );
}

// render(<Booking />, document.getElementById("root"));

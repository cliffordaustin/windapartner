import { Flex, Text, Checkbox } from "@mantine/core";
import { useListState, randomId } from "@mantine/hooks";

const initialValues = [
  {
    label: "Bush meat service(usually from 8pm to 10pm) - $200",
    checked: false,
    key: randomId(),
  },
  { label: "Private chef service - $120", checked: false, key: randomId() },
  {
    label: "Private butler(available anytime of the day) - $100",
    checked: false,
    key: randomId(),
  },
];

type ActivitiesProps = {};

export default function Activities({}: ActivitiesProps) {
  const [values, handlers] = useListState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      key={value.key}
      transitionDuration={200}
      checked={value.checked}
      onChange={(event) =>
        handlers.setItemProp(index, "checked", event.currentTarget.checked)
      }
    />
  ));
  return (
    <div>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        mt={16}
        label="Resident activities"
        className="font-semibold"
        transitionDuration={200}
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
      />
      {items}

      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        mt={16}
        label="Non-Resident activities"
        className="font-semibold"
        transitionDuration={200}
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
      />
      {items}
    </div>
  );
}

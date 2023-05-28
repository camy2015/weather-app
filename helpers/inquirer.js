require("colors");

const loadInquirer = async () => {
  const { default: inquirer } = await import("inquirer");
  return inquirer;
};

const questions = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [
      { value: 1, name: `${"1.".green} Search for a city` },
      { value: 2, name: `${"2.".green} History` },
      { value: 0, name: `${"0.".green} Log off` },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("=================".green);
  console.log(" Select an option".white);
  console.log("=================\n".green);

  const inquirer = await loadInquirer();
  const { option } = await inquirer.prompt(questions);
  return option;
};

const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"ENTER".green} for continue`,
    },
  ];

  console.log("\n");
  const inquirer = await loadInquirer();
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = {
    type: "input",
    name: "desc",
    message,
    validate(value) {
      if (value.length === 0) {
        return "Please enter a value";
      }
      return true;
    },
  };

  const inquirer = await loadInquirer();
  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, index) => {
    const idx = `${index + 1}`.green;

    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0. ".green + "Cancel",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Select place",
      choices,
    },
  ];
  const inquirer = await loadInquirer();
  const { id } = await inquirer.prompt(questions);

  return id;
};

const confirmDelete = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const inquirer = await loadInquirer();
  const { ok } = await inquirer.prompt(question);

  return ok;
};

const showListCheckList = async (tasks = []) => {
  const choices = tasks.map((task, index) => {
    const idx = `${index + 1}`.green;

    return {
      value: task.id,
      name: `${idx} ${task.description}`,
      checked: task.completeIn ? true : false,
    };
  });

  const question = [
    {
      type: "checkbox",
      name: "ids",
      message: "Select",
      choices,
    },
  ];

  const inquirer = await loadInquirer();
  const { ids } = await inquirer.prompt(question);

  return ids;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
  confirmDelete,
  showListCheckList,
};

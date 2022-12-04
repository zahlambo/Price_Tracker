let jobs = cron.getTasks();
  if (jobs.length != 0) {
    jobs.forEach((el) => {
      el.stop();
      // el.destroy(); Why it didn't work?
    });
  } 
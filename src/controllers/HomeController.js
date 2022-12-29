class HomeController {
  index(req, res) {
    res.json({ thatsOk: true });
  }
}

export default new HomeController();

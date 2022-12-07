class DemoUser {
  const DemoUser({required this.userId, required this.token});

  final String userId;
  final String token;
}

const kDemoUserNash = DemoUser(
  userId: "nash",
  token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibmFzaCJ9.fpIT1JmnnMwORqTEPiemTl2Hbh-TqujIG4iuJRmOQK4",
);

const kDemoUserJeroen = DemoUser(
  userId: "jeroen",
  token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiamVyb2VuIn0.NLvdJSJulCjDt82P0Vs0WGtQJtUjwDeJzGvsqS6Qmvg",
);
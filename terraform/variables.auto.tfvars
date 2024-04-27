mandatory_tags = {
  owner         = "bryce.grahn@bbd.co.za"
  created-using = "terraform"
}

account_number = "229582503298"

repo = "spider-recipes/spider-recipes"

region = "eu-west-1"

project_name = "spider-recipes"

vpc_public_subnets = [
  {
    cidr_block = "15.0.1.0/24"
    az         = "eu-west-1a"
  },
  {
    cidr_block = "15.0.3.0/24"
    az         = "eu-west-1b"
}]

vpc_private_subnets = [
  {
    cidr_block = "15.0.5.0/24"
    az         = "eu-west-1a"
  },
  {
    cidr_block = "15.0.7.0/24"
    az         = "eu-west-1b"
}]

db_port = 1433

eb_port_web    = 80
eb_port_server = 80

eb_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDNc09Poz/PzV5XykQBkIM5aqBEI9372ENeJ63/Mh0b5/zcQH8Qk1VYs0S4ZUEVJmTRVhVN9Gs1GdCVs5B7/vyoDlZXRniq7P3A7uVuswhXqK1N1n8yRNG45xR7tjhfnq5K9bU3tYYMqaQ2xFH1NlEBYqdT7A8vwbeEQW/94P3HqKo0UQKMLyjhJC3WVem+M/RmHIRigUG4UIi/+rL1zP2sLwkrRZnxj8Y3bOjRpOtObH9aAVVYE2+ZlrCeS4hFRDBMEsy6jb0lUwXvoGP9CGcxgAz4E8FHWWA5bK4EpEKO3Cr7IkwFrMsC0E1k7LVPy+ShjRfN6am8FlwNyrdItUm5H7z9FTzmDWR/JIqoyW6YekzInBqbMeEylS47LCEB0PSuzCKonfs6d0Y5rqy/hd/6C5S2khBJOBp/PfcWYwuWR4tdT3bF+WhITIFqCwZxry2nhyZwNxQg0Tql2dG+9lnKnBVFTSkt3/xMiABeRaMbAa/iFXBC1QlNTliYoHuLK7M= bbdnet\\bbdnet2527@BryceG"


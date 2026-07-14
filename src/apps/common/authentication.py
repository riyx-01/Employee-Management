from dataclasses import dataclass

import jwt
from django.conf import settings
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError, PyJWKClientError
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed


@dataclass(frozen=True)
class Auth0User:
    claims: dict

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def id(self) -> str:
        return self.claims.get("sub", "")

    @property
    def username(self) -> str:
        return self.claims.get("sub", "")

    @property
    def email(self) -> str:
        return self.claims.get("email", "")

    def __str__(self) -> str:
        return self.username


class Auth0JWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise AuthenticationFailed("Invalid authorization header.")

        token = parts[1]
        payload = self._decode_token(token)
        return Auth0User(payload), token

    def authenticate_header(self, request) -> str:
        return self.keyword

    def _decode_token(self, token: str) -> dict:
        if not settings.AUTH0_DOMAIN or not settings.AUTH0_AUDIENCE:
            raise AuthenticationFailed("Auth0 configuration is missing.")

        issuer = f"https://{settings.AUTH0_DOMAIN}/"
        jwks_url = f"{issuer}.well-known/jwks.json"

        try:
            signing_key = PyJWKClient(jwks_url).get_signing_key_from_jwt(token)
            return jwt.decode(
                token,
                signing_key.key,
                algorithms=settings.AUTH0_ALGORITHMS,
                audience=settings.AUTH0_AUDIENCE,
                issuer=issuer,
            )
        except (InvalidTokenError, PyJWKClientError) as exc:
            raise AuthenticationFailed("Invalid or expired access token.") from exc

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Log, Token } from "../helpers/decorators";
import { useToast } from "../providers/toast-provider";

class AuthValidator {
  @Token
  @Log('Validating User....')
  async validate() {
    return true;
  }
}

const validator = new AuthValidator();

const Validator: React.FC = () => {
  const router = useRouter();
  const {showToast} = useToast();

  useEffect(() => {
    async function checkAuth() {
      const valid = await validator.validate();

      if (!valid) {
        router.push("/pages/login");
        showToast('User not authenticated','error');
      }
    }

    checkAuth();
  }, [router]);

  return null;
};

export default Validator;
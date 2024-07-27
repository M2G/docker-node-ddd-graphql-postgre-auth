function verifyExpiration({ expiryDate }: { expiryDate: Date }): boolean {
  console.log('verifyExpiration', expiryDate < new Date().getTime());
  return expiryDate < new Date().getTime();
}

export default verifyExpiration;
